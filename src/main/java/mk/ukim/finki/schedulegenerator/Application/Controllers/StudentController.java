package mk.ukim.finki.schedulegenerator.Application.Controllers;

import mk.ukim.finki.schedulegenerator.Domain.Services.Impl.StudentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService _studentService;

    public StudentController(StudentService studentService) {
        _studentService = studentService;
    }

    @GetMapping("/total")
    public long returnNumberOfUploadedStudents(){
        return _studentService.numberOfUploadedStudents();
    }

    @PostMapping("insert/all")
    public void InsertAllStudents(@RequestParam("file") MultipartFile file) throws IOException {

        String uploadedFileLocation = "data/" + file.getOriginalFilename();

        try{
            _studentService.InsertAllStudents(file.getInputStream(), uploadedFileLocation);
        }
        catch(Exception ignored){
            String[] files = new File("data").list();
            assert files != null;
            Files.delete(Paths.get("data/" + files[0]));
        }
    }
}
