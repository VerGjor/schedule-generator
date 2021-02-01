package mk.ukim.finki.schedulegenerator.Application.Controllers;

import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.GroupHelper;
import mk.ukim.finki.schedulegenerator.Domain.Services.Impl.GroupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService _groupService;

    public GroupController(GroupService groupService) {
        _groupService = groupService;
    }

    @GetMapping("/fetch")
    public List<GroupHelper> getGeneratedGroups(@RequestParam("groupType") String groupType,
                                                @RequestParam("semester") String semester){
        return _groupService.getGroups(groupType, semester);
    }

    @PostMapping("/generate")
    public void generateGroups(@RequestParam("groupType") String groupType,
                               @RequestParam("semester") String semester) {
        _groupService.generateGroups(groupType, semester);
    }

}
