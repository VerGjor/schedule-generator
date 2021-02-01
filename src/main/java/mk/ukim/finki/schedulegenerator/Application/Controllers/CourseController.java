package mk.ukim.finki.schedulegenerator.Application.Controllers;

import mk.ukim.finki.schedulegenerator.Domain.Services.Impl.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService _courseService;

    public CourseController(CourseService courseService) {
        _courseService = courseService;
    }

    @GetMapping("/all")
    public List<String> getGeneratedCourses(@RequestParam("semester") String semester){
        return _courseService.getGeneratedCoursesBySemester(semester);
    }

    @PostMapping("/create")
    public void CreateCourses(@RequestParam("semester") String semester) {
        _courseService.CreateCourses(semester);
    }

}
