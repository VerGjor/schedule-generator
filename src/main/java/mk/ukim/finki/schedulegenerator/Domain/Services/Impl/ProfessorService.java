package mk.ukim.finki.schedulegenerator.Domain.Services.Impl;

import mk.ukim.finki.schedulegenerator.Domain.Exceptions.SubjectNotFoundException;
import mk.ukim.finki.schedulegenerator.Domain.Exceptions.TeacherNotFoundException;
import mk.ukim.finki.schedulegenerator.Domain.Models.Components.Availability;
import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;
import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.IProfessorRepositoryJPA;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.ISubjectRepositoryJPA;
import mk.ukim.finki.schedulegenerator.Domain.Services.IProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.commons.io.IOUtils;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ProfessorService implements IProfessorService {

    public final static HashMap<String, Professor> professors = new HashMap<>();

    private final IProfessorRepositoryJPA _professorRepository;
    private final ISubjectRepositoryJPA _subjectRepository;

    @PostConstruct
    public void init(){
        List<Professor> professorList = _professorRepository.findAll();

        if(professorList.size() > 0){
            professorList.forEach(professor -> {
                professors.put(professor.getFirstName() + " " + professor.getLastName(), professor);
            });
        }
    }

    @Autowired
    public ProfessorService(IProfessorRepositoryJPA professorRepository,
                            ISubjectRepositoryJPA subjectRepository){
        _professorRepository = professorRepository;
        _subjectRepository = subjectRepository;

    }

    @Override
    public List<Professor> getAllProfessors() {
        return _professorRepository.findAll();
    }

    @Override
    public void createProfessor(String name, String title, String lastName, String jobPosition, String subjects) {
        Save(name, title, lastName, jobPosition, subjects, true);
    }

    @Override
    public void addSubjectToProfessor(int professor_id, int subject_id) {
        Optional<Subject> subject = _subjectRepository.findById(subject_id);
        Optional<Professor> professor = _professorRepository.findById(professor_id);
        if(professor.isPresent() && subject.isPresent()){
            Professor prof = professor.get();
            Subject sub = subject.get();
            prof.get_teachesSubjects().add(sub);
            List<Subject> subjectList = professors.get(prof.getFirstName() +" "+prof.getLastName()).get_teachesSubjects();
            subjectList.add(sub);
            professors.get(prof.getFirstName() +" "+prof.getLastName()).set_teachesSubjects(subjectList);
            _professorRepository.save(prof);
        }
    }

    @Override
    public void addSelectedSubjectsToProfessor(int professor_id, String[] subject_id) {
        Optional<Professor> professor = _professorRepository.findById(professor_id);
        if(professor.isPresent()){
            for(String s : subject_id){
                Optional<Subject> subject = _subjectRepository.findById(Integer.parseInt(s));
                if(subject.isPresent()){
                    Professor prof = professor.get();
                    Subject sub = subject.get();
                    prof.get_teachesSubjects().add(sub);
                    List<Subject> subjectList = professors.get(prof.getFirstName() +" "+prof.getLastName()).get_teachesSubjects();
                    subjectList.add(sub);
                    professors.get(prof.getFirstName() +" "+prof.getLastName()).set_teachesSubjects(subjectList);
                    _professorRepository.save(prof);
                }
            }
        }
    }

    private void deleteByID(int id){
        professors.values().stream().filter(professor -> professor.getId() == id).findFirst()
                .ifPresent(prof -> professors.remove(prof.getFirstName() +" "+prof.getLastName()));
        _professorRepository.deleteById(id);
    }

    @Override
    public void deleteProfessorById(int id) {
        deleteByID(id);
    }

    @Override
    public void removeSelectedSubjectFromProfessor(int professor_id, String[] subject_id) {
        Optional<Professor> professor = _professorRepository.findById(professor_id);
        if(professor.isPresent()){
            for(String s : subject_id){
                Optional<Subject> subject = _subjectRepository.findById(Integer.parseInt(s));
                if(subject.isPresent()){
                    Professor prof = professor.get();
                    Subject sub = subject.get();
                    prof.get_teachesSubjects().remove(sub);
                    List<Subject> subjectList = professors.get(prof.getFirstName() +" "+prof.getLastName()).get_teachesSubjects();
                    subjectList.remove(sub);
                    professors.get(prof.getFirstName() +" "+prof.getLastName()).set_teachesSubjects(subjectList);
                    _professorRepository.save(prof);
                }
            }
        }
    }

    @Override
    public void clearAllSelectedProfessorsData(String[] IDs) {
        for(String id : IDs){
            deleteByID(Integer.parseInt(id));
        }
    }

    @Override
    public void deleteAllProfessors() {
        professors.clear();
        _professorRepository.deleteAll();
    }

    private void updateDetails(int id, String name, String title, String lastName, String jobPosition, String subjects){

        Optional<Professor> temp = _professorRepository.findById(id);

        boolean update = false;
        if(temp.isPresent()){
            if(!temp.get().getFirstName().equals(name)) {
                temp.get().setFirstName(name);
                update = true;
            }

            if(!temp.get().getTitle().equals(title)) {
                temp.get().setTitle(title);
                update = true;
            }

            if(!temp.get().getLastName().equals(lastName)) {
                temp.get().setLastName(lastName);
                update = true;
            }

            if(!temp.get().getPosition().equals(jobPosition)) {
                temp.get().setPosition(jobPosition);
                update = true;
            }

            if(!subjects.equals("")){
                String[] subjectNames = subjects.split(";");
                List<Subject> subjectList = new ArrayList<>();

                for (String sub : subjectNames) {
                    Optional<Subject> s = _subjectRepository.findById(Integer.parseInt(sub));
                    s.ifPresent(subjectList::add);
                }

                temp.get().set_teachesSubjects(subjectList);
                update = true;
            }

            if(update) {
                _professorRepository.save(temp.get());
                professors.replace(name+" "+lastName, temp.get());
            }
        }
    }

    @Override
    public void updateProfessorDetails(int id, String name, String title, String lastName, String jobPosition, String subjects) throws TeacherNotFoundException{
       updateDetails(id, name, title, lastName, jobPosition, subjects);
    }

    @Override
    public Professor getProfessorById(int id) throws TeacherNotFoundException{
        return _professorRepository.findById(id).orElseThrow(TeacherNotFoundException::new);
    }

    @Override
    public Professor getProfessorByFullName(String professor_full_name) {
        String[] professor = professor_full_name.split("_");
        return _professorRepository.findByFirstNameAndLastName(professor[0], professor[1]);
        //return professors.get(professor_full_name.replace("_", " "));
    }

    @Override
    public void InsertAllProfessorsInDatabase(InputStream uploadedInputStream, String uploadedFileLocation) throws Exception {

        byte[] bytes = IOUtils.toByteArray(uploadedInputStream);
        FileOutputStream fop = new FileOutputStream(uploadedFileLocation);
        fop.write(bytes);
        fop.flush();
        fop.close();

        ReadProfessorsFromFile();
    }

    @Override
    public void ReadProfessorsFromFile() throws Exception {

        _professorRepository.deleteAllInBatch();
        professors.clear();

        String path = "data/" + Objects.requireNonNull(new File("data").list())[0];
        List<String> professorsFromFile = Files.readAllLines(Paths.get(path));
        Files.delete(Paths.get(path));

        if(professorsFromFile.get(0).contains("First Name,Title,Last Name,Faculty Position,Teaches")){
            professorsFromFile.parallelStream().parallel().skip(1).forEach(s -> {
                String[] currentProfessor = s.split(",");
                if(currentProfessor.length == 5)
                    Save(currentProfessor[0], currentProfessor[1], currentProfessor[2], currentProfessor[3], currentProfessor[4], false);
            });
        }
    }

    @Override
    public List<Availability> getProfessorAvailability(int id) throws TeacherNotFoundException{
        return _professorRepository
                .findById(id)
                .orElseThrow(TeacherNotFoundException::new)
                .get_availableAt();
    }

    @Override
    public void addNewOccupiedPeriodForTeacher(int teacher_id, String availability_day, int timeFrom, int timeTo) throws Exception {
        Professor professor =
                _professorRepository
                        .findById(teacher_id)
                        .orElseThrow(TeacherNotFoundException::new);

        if(professor.getAvailabilityByDay(availability_day).getAvailability().isFree(timeFrom, timeTo)) {
            professor.getAvailabilityByDay(availability_day).getAvailability().reserve(timeFrom, timeTo);
            professor.set_availableAt(professor.get_availableAt());
            _professorRepository.save(professor);
        }
    }

    @Override
    public void freeOccupiedPeriodForTeacher(int teacher_id, String availability_day, int timeFrom, int timeTo) throws Exception {
        Professor professor =
                _professorRepository
                        .findById(teacher_id)
                        .orElseThrow(TeacherNotFoundException::new);

        if(!professor.getAvailabilityByDay(availability_day).getAvailability().isFree(timeFrom, timeTo)) {
            professor.getAvailabilityByDay(availability_day).getAvailability().free(timeFrom, timeTo);
            professor.set_availableAt(professor.get_availableAt());
            _professorRepository.save(professor);
        }
    }

    private void Save(String firstName, String title, String lastName, String jobPosition, String subjects, boolean createOne) throws SubjectNotFoundException {

        if(!professors.containsKey(firstName + " " + lastName)){
            Professor createProfessor = new Professor();

            createProfessor.setFirstName(firstName);
            createProfessor.setLastName(lastName);
            createProfessor.setTitle(title);
            createProfessor.setPosition(jobPosition);

            List<Subject> subjectList = new ArrayList<>();

            if(!subjects.equals("")) {
                String[] subjectNames = subjects.split(";");

                for (String name : subjectNames) {
                    if(createOne){
                        Optional<Subject> s = _subjectRepository.findById(Integer.parseInt(name));
                        s.ifPresent(subjectList::add);
                    }
                    else{
                        if(SubjectService.subjectsDictionary.containsKey(name.toUpperCase().trim()))
                            subjectList.add(SubjectService.subjectsDictionary.get(name.toUpperCase().trim()));
                    }

                }
            }
            createProfessor.set_teachesSubjects(subjectList);
            createProfessor.set_availableAt(new Availability().fillInitAvailabilities());

            _professorRepository.save(createProfessor);
            professors.put(createProfessor.getFirstName()+" "+createProfessor.getLastName(), createProfessor);

        }
        else{
            Professor professor = professors.get(firstName+" "+lastName);
            updateDetails(
                    professor.getId(),
                    firstName,
                    title,
                    lastName,
                    jobPosition,
                    subjects);
        }
    }

}
