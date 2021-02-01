package mk.ukim.finki.schedulegenerator.Domain.Services.Impl;
import mk.ukim.finki.schedulegenerator.Domain.Models.Components.Occurrences;
import mk.ukim.finki.schedulegenerator.Domain.Models.Student;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.IStudentRepositoryJPA;
import mk.ukim.finki.schedulegenerator.Domain.Services.IStudentService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
public class StudentService implements IStudentService {

    static final Vector<Student> students = new Vector<>();

    private final IStudentRepositoryJPA _studentRepository;

    @PostConstruct
    public void init(){
        _studentRepository.deleteAll();
    }

    @Autowired
    public StudentService(IStudentRepositoryJPA studentRepository){
        this._studentRepository = studentRepository;
    }

    @Override
    public void InsertAllStudents(InputStream uploadedInputStream, String uploadedFileLocation) throws Exception {
        byte[] bytes = IOUtils.toByteArray(uploadedInputStream);
        FileOutputStream fop = new FileOutputStream(uploadedFileLocation);
        fop.write(bytes);

        fop.flush();
        fop.close();

        ReadStudentsFromFile();
    }

    @Override
    public long numberOfUploadedStudents() {
        long size = students.size();
        return size > 0 ? size : -1 ;
    }

    private void ReadStudentsFromFile() throws Exception {

        String path = "data/" + Objects.requireNonNull(new File("data").list())[0];
        List<String> studentsFromFile = Files.readAllLines(Paths.get(path));
        Files.delete(Paths.get(path));

        if (studentsFromFile.get(0).contains("Student Index,Subjects")) {

            studentsFromFile.stream().skip(1).forEach(s -> {
                String[] currentStudent = s.split(",");

                if (currentStudent.length == 2) {
                    Student createStudent = new Student();
                    createStudent.setIndex(currentStudent[0]);
                    String[] names = currentStudent[1].split(";");
                    List<Occurrences> subjectList = new ArrayList<>();

                    for (String name : names) {
                        if(name.contains("_")){
                            String[] nameSplit = name.split("_");
                            if (nameSplit.length == 2 && SubjectService.subjectsDictionary.containsKey(nameSplit[1].toUpperCase().trim())) {
                                String name_occurrence = name.toUpperCase().trim();
                                subjectList.add(SubjectService.occurrencesDictionary.get(name_occurrence));
                            }
                        }
                    }
                    createStudent.setSubjectOccurrencesForStudent(subjectList);
                    students.add(createStudent);
                }
            });
            _studentRepository.saveAll(students);
        }
    }
}
