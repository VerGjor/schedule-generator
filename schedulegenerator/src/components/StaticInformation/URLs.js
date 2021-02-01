export const getSubjectByName = "http://localhost:8080/subjects/subject/";
export const getSubjectsBySemester = "http://localhost:8080/subjects/semester/";
export const getAllSubjectsURL = "http://localhost:8080/subjects";
export const insertSubjectURL = "http://localhost:8080/subjects/create_subject";
export const insertAllSubjectsURL = "http://localhost:8080/subjects/insert/all";
export const updateSubjectByID = "http://localhost:8080/subjects/update/subject/";
export const deleteSubjectByID = "http://localhost:8080/subjects/delete/subject/";
export const deleteAllSubjects = "http://localhost:8080/subjects/delete/all";
export const deleteSelectedSubjects = "http://localhost:8080/subjects/delete/selected/";

export const getProfessorById = "http://localhost:8080/professors/";
export const getProfessorByFullName = "http://localhost:8080/professors/professor/";
export const getAllProfessorsURL = "http://localhost:8080/professors/all";
export const insertProfessorURL = "http://localhost:8080/professors/insert";
export const insertAllProfessorsURL = "http://localhost:8080/professors/insert/all";
export const updateProfessorByID = "http://localhost:8080/professors/update/";
export const deleteProfessorByID = "http://localhost:8080/professors/delete/";
export const deleteAllProfessors = "http://localhost:8080/professors/delete/all";
export const deleteSelectedProfessors = "http://localhost:8080/professors/delete/selected/";
export const removeSubjectFromProfessors = "http://localhost:8080/professors/delete/professor/";

export const getTotalStudentsURL = "http://localhost:8080/students/total";
export const insertAllStudentsURL = "http://localhost:8080/students/insert/all";

export const createCoursesForCurrentSemester = "http://localhost:8080/courses/create";
export const getAllCoursesForCurrentSemester = "http://localhost:8080/courses/all?semester=";

export const createGroup = "http://localhost:8080/groups/generate";
export const getAllGeneratedGroups = "http://localhost:8080/groups/fetch";