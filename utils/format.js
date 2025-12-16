export default function formatProject(project) {
    return {
        ...project,
        techs: project.projectTechs?.map(tech => tech.techs.value),
        startFormatted: project.dateStart.toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        }),
        endFormatted: project.dateEnd.toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        })
    };
}