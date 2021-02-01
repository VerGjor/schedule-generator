package mk.ukim.finki.schedulegenerator.Domain.Services.Impl;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.Occurrences;
import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;
import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.CoursesSubjectsHelper;
import mk.ukim.finki.schedulegenerator.Domain.Services.ISubjectService;
import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.*;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubjectService implements ISubjectService {

    static final Map<String, Subject> subjectsDictionary = new LinkedHashMap<>();
    static final Map<String, Occurrences> occurrencesDictionary = new HashMap<>();

    private final ISubjectRepositoryJPA _subjectRepository;
    private final IProfessorRepositoryJPA _professorIProfessorRepository;
    private final IStudentRepositoryJPA studentRepository;
    private final ICourseRepositoryJPA courseRepository;
    private final IGroupRepositoryJPA groupRepository;
    private final IOccurrencesRepositoryJPA occurrencesRepository;

    @Autowired
    public SubjectService(ISubjectRepositoryJPA subjectRepository, IProfessorRepositoryJPA professorIProfessorRepository, IStudentRepositoryJPA studentRepository, ICourseRepositoryJPA courseRepository, IGroupRepositoryJPA groupRepository, IOccurrencesRepositoryJPA occurrencesRepository){
        this._subjectRepository = subjectRepository;
        this._professorIProfessorRepository = professorIProfessorRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.groupRepository = groupRepository;
        this.occurrencesRepository = occurrencesRepository;
    }

    @PostConstruct
    public void init(){
        List<Subject> subjects = _subjectRepository.findAll();

        if(subjects.size() > 0){
            subjects.forEach(subject -> {
                subject.setProfessors(new ArrayList<>());
                _subjectRepository.save(subject);
                subjectsDictionary.put(subject.getName().toUpperCase().trim(), subject);
                insertOccurrencesForSubject(subject.getName());
            });
        }
    }

    private void insertOccurrencesForSubject(String name){
        List<Occurrences> occurrences = new ArrayList<>();
        for(int i=1; i < 11; i++){
            Occurrences o = new Occurrences();
            String key = i + "_" + name.toUpperCase();
            o.setOccurrences(key);
            occurrences.add(o);
            occurrencesDictionary.put(key, o);
        }
        occurrencesRepository.saveAll(occurrences);
    }

    private void deleteOccurrencesForSubject(String name){
        List<Occurrences> occurrences = occurrencesRepository.findAll();

        for(int i=1; i < 11; i++){
            String key = i + "_" + name.toUpperCase().trim();
            occurrencesRepository.delete(occurrencesDictionary.get(key));
        }

        occurrences.stream().filter(o -> o.getSubject().equals(name.toUpperCase()))
                .forEach(o -> occurrencesDictionary.remove(o.getID()));

    }

    @Override
    public void Create(Subject subject) {
        subject.setProfessors(new ArrayList<>());
        subjectsDictionary.put(subject.getName().toUpperCase().trim(), subject);
        _subjectRepository.save(subject);

        insertOccurrencesForSubject(subject.getName());
    }

    @Override
    public int getSubjectIDByName(String subject_name) {
        return subjectsDictionary.get(subject_name.toUpperCase().trim()).getId();
    }

    @Override
    public List<Subject> getAllSubjects() {

        groupRepository.deleteAllInBatch();
        courseRepository.deleteAllInBatch();
        studentRepository.deleteAllInBatch();
        StudentService.students.clear();

        List<Subject> subjects = new ArrayList<>(_subjectRepository.findAll());
        subjects.forEach(subject -> {
            subject.setProfessors(new ArrayList<>());
        });
        _subjectRepository.saveAll(subjects);
        return subjects;
    }

    @Override
    public List<CoursesSubjectsHelper> getAllSubjectsBySemester(String semester) {
        List<Subject> subjects = new ArrayList<>(_subjectRepository.findAllBySemester(semester));
        /*List<Subject> subjects =
                subjectsDictionary.values().stream()
                        .filter(subject -> subject.getSemester().equals(semester)).collect(Collectors.toList());*/

        List<Professor> professorsFromDB = new ArrayList<>(_professorIProfessorRepository.findAll());

        List<CoursesSubjectsHelper> courses = new ArrayList<>();

        subjects.forEach(subject -> {
            List<Professor> professorsOfSubject = new ArrayList<>();

            professorsFromDB.forEach(professor -> {
                if(professor.get_teachesSubjects().stream().anyMatch(s -> s.getId() == subject.getId())){
                    professorsOfSubject.add(professor);
                }
            });

            courses.add(new CoursesSubjectsHelper(subject, professorsOfSubject));

        });

        return courses;
    }

    @Override
    public void InsertAllSubjectsInDatabase(InputStream uploadedInputStream, String uploadedFileLocation) throws Exception {
        byte[] bytes = IOUtils.toByteArray(uploadedInputStream);
        FileOutputStream fop = new FileOutputStream(uploadedFileLocation);
        fop.write(bytes);

        fop.flush();
        fop.close();

        ReadSubjectsFromFile();
    }

    @Override
    public void clearSubjectData() {
        clearData();
    }

    private void clearData(){
        studentRepository.deleteAll();
        occurrencesRepository.deleteAll();
        occurrencesDictionary.clear();
        _professorIProfessorRepository.deleteAll();
        _subjectRepository.deleteAll();
        ProfessorService.professors.clear();
        subjectsDictionary.clear();
    }


    public void delete(int id){
        for(Subject subject : subjectsDictionary.values()){
            if(subject.getId() == id){
                deleteOccurrencesForSubject(subject.getName());
                List<Professor> professorsTeachSubject = new ArrayList<>(ProfessorService.professors.values());

                professorsTeachSubject.forEach(professor -> {
                    Optional<Professor> pDB = _professorIProfessorRepository.findById(professor.getId());
                    pDB.ifPresent(professor1 -> {
                        List<Subject> subjects = professor1.get_teachesSubjects();
                        subjects.removeAll(subjects.stream().filter(subject1 ->  subject1.getId() == subject.getId()).collect(Collectors.toList()));
                        professor1.set_teachesSubjects(subjects);
                        ProfessorService.professors.get(professor1.getFirstName() +" "+professor1.getLastName()).set_teachesSubjects(subjects);
                        _professorIProfessorRepository.save(professor1);
                    });
                });
                subjectsDictionary.remove(subject.getName().toUpperCase().trim());
                _subjectRepository.deleteById(id);
                break;
            }
        }
    }

    @Override
    public void deleteSubject(int id) {
        delete(id);
    }

    @Override
    public void clearAllSubjectData(String[] IDs) {
        for(String id : IDs){
            delete(Integer.parseInt(id));
        }
    }

    @Override
    public void updateSubjectInfo(@Nullable int id, String name, String semester, String hasLab) {
        boolean update = false;
        Subject subject = _subjectRepository.findById(id).orElse(_subjectRepository.findByName(name));
        if(!subject.getSemester().equals(semester)){
            subject.setSemester(semester);
            update = true;
        }

        if(subject.isHasLaboratoryExercises() != Boolean.parseBoolean(hasLab)){
            subject.setHasLaboratoryExercises(Boolean.parseBoolean(hasLab));
            update = true;
        }

        if(update) {
            subjectsDictionary.replace(name.toUpperCase().trim(), subject);
            _subjectRepository.save(subject);
        }
    }

    @Override
    public void ReadSubjectsFromFile() throws Exception {

        clearData();
        String path = "data/" + Objects.requireNonNull(new File("data").list())[0];
        List<String> subjects = Files.readAllLines(Paths.get(path));

        Files.delete(Paths.get(path));

        if(subjects.get(0).contains("Subject Name,Semester,Has Laboratory Exercises")) {
            subjects.stream().skip(1).forEach(s -> {
                String[] subject = s.split(",");
                if (subject.length == 3)
                    Save(subject[0], subject[1], subject[2]);
            });
        }
    }

    private void Save(String name, String semester, String hasLab){

        if(!_subjectRepository.existsByName(name)){
            Subject subject = new Subject();

            subject.setName(name);
            subject.setSemester(semester);
            subject.setHasLaboratoryExercises(Boolean.parseBoolean(hasLab));

            _subjectRepository.save(subject);
            subjectsDictionary.put(name.toUpperCase().trim(), subject);

            insertOccurrencesForSubject(name);
        }
    }
}
