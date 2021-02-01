package mk.ukim.finki.schedulegenerator.Application.Controllers;

import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.CoursesSubjectsHelper;
import mk.ukim.finki.schedulegenerator.Domain.Services.Impl.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectService _subjectService;

    @Autowired
    public SubjectController(SubjectService subjectService){
        _subjectService = subjectService;
    }

    @GetMapping("/subject/{subject_name}")
    public int getSubjectIDByName(@PathVariable("subject_name") String subject_name){
        return _subjectService.getSubjectIDByName(subject_name);
    }

    @GetMapping()
    public List<Subject> GetAllSubjects(){
        return _subjectService.getAllSubjects();
    }

    @GetMapping("/semester/{semester}")
    public List<CoursesSubjectsHelper> GetAllSubjectsBySemester(@PathVariable("semester") String semester){
        return _subjectService.getAllSubjectsBySemester(semester);
    }

    @PostMapping("/insert/all")
    public void InsertAllSubjects(@RequestParam("file") MultipartFile file) throws IOException {

        String uploadedFileLocation = "data/" + file.getOriginalFilename();

        try{
            _subjectService.InsertAllSubjectsInDatabase(file.getInputStream(), uploadedFileLocation);
        }
        catch(Exception ex){
            String[] files = new File("data").list();
            assert files != null;
            Files.delete(Paths.get("data/" + files[0]));
        }
    }

    @PostMapping(value="/create_subject", produces = "application/json")
    public void CreateSubject(@RequestBody Map<String,String> body){
        Subject subject = new Subject();
        subject.setName(body.get("name"));
        subject.setSemester(body.get("semester"));
        subject.setHasLaboratoryExercises(Boolean.parseBoolean(body.get("hasLaboratoryExercises")));
        _subjectService.Create(subject);
    }

    @PutMapping(value="/update/subject/{id}", produces = "application/json")
    public void updateSubjectInfo(@PathVariable("id") int id, @RequestBody Map<String,String> body){
        _subjectService.updateSubjectInfo(
                id,
                body.get("name"),
                body.get("semester"),
                body.get("hasLaboratoryExercises"));
    }

    @PostMapping("/read")
    public void ReadAll() throws Exception {
        _subjectService.ReadSubjectsFromFile();
    }

    @DeleteMapping("/delete/subject/{id}")
    public void DeleteSubject(@PathVariable("id") int id) {
        _subjectService.deleteSubject(id);
    }

    @DeleteMapping("/delete/selected/{IDs}")
    public void ClearSelectedSubjectsData(@PathVariable("IDs") String[] IDs){
        _subjectService.clearAllSubjectData(IDs);
    }

    @DeleteMapping("/delete/all")
    public void ClearSubjectsData(){
        _subjectService.clearSubjectData();
    }

}
