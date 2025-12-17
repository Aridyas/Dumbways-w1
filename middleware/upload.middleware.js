import multer from "multer";

export const projectImage = multer({
  dest: "uploads/"
});

export const profileImage = multer({
  dest: "profiles/"
})