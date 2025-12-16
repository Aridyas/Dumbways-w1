import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;

export function formatProject(project) {
    return {
        ...projects,
        techs: project.projectTechs?.map(tech => tech.techs.value),
        startFormatted: project.dateStart.toLocaleString("en-US"),
        endFormatted: project.dateEnd.toLocaleString("en-US")
    };
}