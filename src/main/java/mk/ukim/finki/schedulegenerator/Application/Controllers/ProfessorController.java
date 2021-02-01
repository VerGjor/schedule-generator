package mk.ukim.finki.schedulegenerator.Application.Controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.Availability;
import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;
import mk.ukim.finki.schedulegenerator.Domain.Services.Impl.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/professors")
public class ProfessorController {

    private final ProfessorService _professorService;

    @Autowired
    public ProfessorController(ProfessorService _professorService) {
        this._professorService = _professorService;
    }

    @PostMapping("/insert/all")
    public void InsertAllProfessors(@RequestParam("file") MultipartFile file) throws IOException {

        String uploadedFileLocation = "data/" + file.getOriginalFilename();

        try{
            _professorService.InsertAllProfessorsInDatabase(file.getInputStream(), uploadedFileLocation);
        }
        catch(Exception ex){
            String[] files = new File("data").list();
            assert files != null;
            Files.delete(Paths.get("data/" + files[0]));
        }
    }

    @GetMapping("/all")
    public List<Professor> GetAllProfessors(){
        return _professorService.getAllProfessors();
    }

    @GetMapping("/{id}")
    public Professor GetProfessorById(@PathVariable("id") int id){
        return _professorService.getProfessorById(id);
    }

    @GetMapping("/professor/{professor_full_name}")
    public Professor getProfessorByFullName(@PathVariable("professor_full_name") String professor_full_name){
        return _professorService.getProfessorByFullName(professor_full_name);
    }

    @GetMapping("/{id}/availability")
    public List<Availability> getProfessorAvailability(@PathVariable("id") int id){
        return _professorService.getProfessorAvailability(id);
    }

    @PostMapping(value = "/insert", produces = "application/json")
    public void CreateProfessor(@RequestBody Map<String, String> body){
        _professorService.createProfessor(
                body.get("firstName"),
                body.get("title"),
                body.get("lastName"),
                body.get("jobPosition"),
                body.get("subjects"));
    }

    @PutMapping("/add/professor/{professor_id}/subject/{subject_id}")
    public void addSubjectFromProfessor(
            @PathVariable("professor_id") int professor_id,
            @PathVariable("subject_id") int subject_id){
        _professorService.addSubjectToProfessor(professor_id, subject_id);
    }

    @PutMapping("/add/all/professor/{professor_id}/subjects/{subject_id}")
    public void addSelectedSubjectFromProfessor(
            @PathVariable("professor_id") int professor_id,
            @PathVariable("subject_id") String[] subject_id){
        _professorService.addSelectedSubjectsToProfessor(professor_id, subject_id);
    }

    @DeleteMapping("/delete/{id}")
    public void DeleteProfessor(@PathVariable("id") int id) {
        _professorService.deleteProfessorById(id);
    }

    @PutMapping(value = "/update/{id}", produces = "application/json")
    public void UpdateProfessorDetails(
            @PathVariable("id") int id,
            @RequestBody Map<String, String> body){

        _professorService.updateProfessorDetails(
                id,
                body.get("firstName"),
                body.get("title"),
                body.get("lastName"),
                body.get("jobPosition"),
                body.get("subjects"));
    }

    @PutMapping("/{p_id}/availability/{a_id}/reserve")
    public void reserveProfessor(
            @PathVariable("p_id") int professor_id,
            @PathVariable("a_id") String availability_id,
            @RequestParam int from,
            @RequestParam int to) throws Exception {

        _professorService.addNewOccupiedPeriodForTeacher(professor_id, availability_id, from, to);
    }

    @PutMapping("/{p_id}/availability/{a_id}/free")
    public void freeProfessor(
            @PathVariable("p_id") int professor_id,
            @PathVariable("a_id") String availability_id,
            @RequestParam int from,
            @RequestParam int to) throws Exception {

        _professorService.freeOccupiedPeriodForTeacher(professor_id, availability_id, from, to);
    }

    @DeleteMapping("/delete/selected/{IDs}")
    public void ClearSelectedProfessorsData(@PathVariable("IDs") String[] IDs){
        _professorService.clearAllSelectedProfessorsData(IDs);
    }

    @DeleteMapping("/delete/professor/{professor_id}/subjects/{subject_id}")
    public void removeSubjectFromProfessor(
            @PathVariable("professor_id") int professor_id,
            @PathVariable("subject_id") String[] subject_id){
        _professorService.removeSelectedSubjectFromProfessor(professor_id, subject_id);
    }

    @DeleteMapping("/delete/all")
    public void ClearProfessorsData(){
        _professorService.deleteAllProfessors();
    }
}
