package mk.ukim.finki.schedulegenerator.Domain.Services;

import mk.ukim.finki.schedulegenerator.Domain.Exceptions.AvailabilityNotFoundException;
import mk.ukim.finki.schedulegenerator.Domain.Models.Components.Availability;
import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;

import java.io.InputStream;
import java.util.List;

public interface IProfessorService {

    List<Professor> getAllProfessors();
    void createProfessor(String name, String title, String lastName, String jobPosition, String subjects);
    void addSubjectToProfessor(int professor_id, int subject_id);
    void addSelectedSubjectsToProfessor(int professor_id, String[] subject_id);
    void deleteProfessorById(int id);
    void removeSelectedSubjectFromProfessor(int professor_id, String[] subject_id);
    void clearAllSelectedProfessorsData(String[] IDs);
    void deleteAllProfessors();
    void updateProfessorDetails(int id, String name, String title, String lastName, String jobPosition, String subjects);
    void InsertAllProfessorsInDatabase(InputStream uploadedInputStream, String uploadedFileLocation) throws Exception;
    Professor getProfessorById(int id);
    Professor getProfessorByFullName(String professor_full_name);
    void ReadProfessorsFromFile() throws Exception;
    List<Availability> getProfessorAvailability(int id) throws AvailabilityNotFoundException;
    void addNewOccupiedPeriodForTeacher(int teacher_id, String availability_id, int timeFrom, int timeTo) throws Exception;
    void freeOccupiedPeriodForTeacher(int teacher_id, String availability_id, int timeFrom, int timeTo) throws Exception;
}
