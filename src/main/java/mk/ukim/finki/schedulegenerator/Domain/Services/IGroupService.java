package mk.ukim.finki.schedulegenerator.Domain.Services;

import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.GroupHelper;

import java.util.List;

public interface IGroupService {
    void assignProfessorToGroup(int professorID, int groupID);
    void generateGroups(String groupType, String semester) throws Exception;
    List<GroupHelper> getGroups(String groupType, String semester);
}
