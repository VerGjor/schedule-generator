package mk.ukim.finki.schedulegenerator.Domain.Services.Helpers;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.SchoolYear;
import mk.ukim.finki.schedulegenerator.Domain.Models.Enums.GroupType;
import mk.ukim.finki.schedulegenerator.Domain.Models.Group;

import java.time.LocalDate;
import java.util.List;
import java.util.Vector;
import java.util.stream.Collectors;

public class GroupHelper extends ProfessorHelper{

    private String subjectName;
    private int totalGeneratedGroups;
    private List<GroupDetails> details;

    public GroupHelper(String subjectName, int totalGeneratedGroups, List<GroupDetails> details) {
        this.subjectName = subjectName;
        this.totalGeneratedGroups = totalGeneratedGroups;
        this.details = details;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public int getTotalGeneratedGroups() {
        return totalGeneratedGroups;
    }

    public void setTotalGeneratedGroups(int totalGeneratedGroups) {
        this.totalGeneratedGroups = totalGeneratedGroups;
    }

    public List<GroupDetails> getDetails() {
        return details;
    }

    public void setDetails(List<GroupDetails> details) {
        this.details = details;
    }

    public static SchoolYear getSchoolYear(String semester){
        boolean isWinter = semester.equals("Winter");
        String schoolYear = isWinter ?
                LocalDate.now().getYear() + "/" + (LocalDate.now().getYear() + 1)
                : (LocalDate.now().getYear() - 1) + "/" + LocalDate.now().getYear();

        return new SchoolYear(isWinter, schoolYear);
    }

    public static Vector<Group> removeElementsWithSubject(Vector<Group> groups, int id){
        groups.removeAll(groups.stream()
                .filter(group -> group.getCourse().getSubject().getId() == id)
                .collect(Collectors.toCollection(Vector::new)));
        return groups;
    }

    public static Group getNextElement(int i, Vector<Group> group, Vector<Group> allGroups, int subjectID, GroupType groupType){

        // Number of currently assigned professors
        long countAssignments = allGroups.stream().filter(
                g -> g.getProfessor() != null
                && g.getCourse().getSchoolYear() == g.getCourse().getSchoolYear()
                && g.getCourse().getSubject().getId() == subjectID).count();

        // Number of professors that could teach the subject
        long countNonAssigned = getProfessorCouldTeachSubject(getProfessorPosition(groupType.getType()), subjectID).size();

        if((countAssignments != countNonAssigned) && i < group.size()){
            if(group.get(i).getProfessor() == null && group.get(i).getCourse().getSubject().getId() == subjectID){
                return group.get(i);
            }
            else getNextElement(i + 1, group, allGroups, subjectID, groupType);
        }
        return null;
    }

}
