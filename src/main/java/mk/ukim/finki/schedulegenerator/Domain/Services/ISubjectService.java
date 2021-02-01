package mk.ukim.finki.schedulegenerator.Domain.Services;

import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.CoursesSubjectsHelper;

import java.io.InputStream;
import java.util.List;

public interface ISubjectService {

    void Create(Subject subject);
    int getSubjectIDByName(String subject_name);
    List<Subject> getAllSubjects();
    List<CoursesSubjectsHelper> getAllSubjectsBySemester(String semester);
    void ReadSubjectsFromFile() throws Exception;
    void InsertAllSubjectsInDatabase(InputStream uploadedInputStream, String uploadedFileLocation) throws Exception;
    void clearSubjectData();
    void deleteSubject(int id);
    void clearAllSubjectData(String[] IDs);
    void updateSubjectInfo(int id, String name, String semester, String hasLab);
}
