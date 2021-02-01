package mk.ukim.finki.schedulegenerator.Domain.Services.Impl;

import java.util.*;
import java.util.stream.Collectors;

import mk.ukim.finki.schedulegenerator.Domain.Models.Components.SchoolYear;
import mk.ukim.finki.schedulegenerator.Domain.Models.Course;
import mk.ukim.finki.schedulegenerator.Domain.Models.Enums.GroupType;
import mk.ukim.finki.schedulegenerator.Domain.Models.Group;
import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;
import mk.ukim.finki.schedulegenerator.Domain.Services.Comparators.CourseComparator;
import mk.ukim.finki.schedulegenerator.Domain.Services.Comparators.GroupComparator;
import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.GroupDetails;
import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.GroupHelper;
import mk.ukim.finki.schedulegenerator.Domain.Services.Helpers.ProfessorHelper;
import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.ICourseRepositoryJPA;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.IProfessorRepositoryJPA;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.IGroupRepositoryJPA;
import mk.ukim.finki.schedulegenerator.Infrastructure.Repository.ISubjectRepositoryJPA;
import mk.ukim.finki.schedulegenerator.Domain.Services.IGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;

@Service
public class GroupService implements IGroupService{

    private final static Vector<Group> groups = new Vector<>();
    private final IProfessorRepositoryJPA professorRepository;
    private final ISubjectRepositoryJPA subjectRepository;
    private final ICourseRepositoryJPA courseRepository;
    private final IGroupRepositoryJPA groupRepository;

    @Autowired
    public GroupService(IProfessorRepositoryJPA professorRepository,
                        ICourseRepositoryJPA courseRepository,
                        ISubjectRepositoryJPA subjectRepository,
                        IGroupRepositoryJPA groupRepository) {
        this.professorRepository = professorRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.groupRepository = groupRepository;
    }

    @Override
    public List<GroupHelper> getGroups(String groupType, String semester) {
        SchoolYear year = GroupHelper.getSchoolYear(semester);
        Map<String, GroupHelper> currentGroups = new HashMap<>();
        List<Group> groupsFromDB = new ArrayList<>(groupRepository.findAll());
        groupsFromDB
                .stream()
                .filter(group -> group.getType().equals(groupType))
                .filter(group -> group.getCourse().getSchoolYear().getSchoolYear().equals(year.getSchoolYear()))
                .forEach(group -> {
            if(!currentGroups.containsKey(group.getCourse().getSubject().getName().toUpperCase())){
                String key = group.getCourse().getSubject().getName();
                List<GroupDetails> details = new ArrayList<>();
                List<Group> professorList = groupsFromDB.stream()
                        .filter(g -> g.getType().equals(groupType))
                        .filter(g -> g.getCourse().getSubject().getId() == group.getCourse().getSubject().getId())
                        .filter(g -> g.getCourse().getSchoolYear().getSchoolYear().equals(year.getSchoolYear()))
                        .collect(Collectors.toList());

                professorList.forEach(g -> {
                    if(g.getProfessor() != null) {
                        String name = g.getProfessor().getFirstName() + " " + g.getProfessor().getLastName();
                        details.add(new GroupDetails(g.getCapacity(), name));
                    }
                });
                currentGroups.put(key.toUpperCase(), new GroupHelper(key, professorList.size(), details));
            }
        });

        return new ArrayList<>(currentGroups.values());
    }

    @Override
    public void assignProfessorToGroup(int professorID, int groupID) {
        boolean fetchGroup = groups.stream().anyMatch(g -> g.getId() == groupID);
        if(fetchGroup){
            Optional<Group> group = groupRepository.findById(groupID);
            Optional<Professor> professor = professorRepository.findById(professorID);
            group.flatMap(g -> professor).ifPresent(p -> {
                updateProfessorsOfCourse(p, group.get().getCourse());
                group.get().setProfessor(p);
                groupRepository.save(group.get());
            });
        }
    }

    @Override
    @Transactional
    public void generateGroups(String groupType, String semester) {

        // Clear existing data
        groups.clear();

        // Generate the year of the course by the given semester
        SchoolYear schoolYear = GroupHelper.getSchoolYear(semester);
        int groupMaxCapacity = groupType.equals("Laboratory") ? 20 : 100;

        // Populate the course list with subjects according to the type of the group
        List<Course> courses = new ArrayList<>();
        List<Course> finalCourses = courses;
        if (groupType.equals("Laboratory")) {
            courseRepository.findAll().forEach(course -> {
                if(course.getSchoolYear().getSchoolYear().equals(schoolYear.getSchoolYear()) && course.getSubject().isHasLaboratoryExercises()){
                    finalCourses.add(course);
                }
            });
        }
        else {
            courseRepository.findAll().forEach(course -> {
                if(course.getSchoolYear().getSchoolYear().equals(schoolYear.getSchoolYear())){
                    finalCourses.add(course);
                }
            });
        }
        courses = new ArrayList<>(finalCourses);
        courses.sort(new CourseComparator());

        courses.forEach(course -> {

            // If the number of students that are first time listeners is bellow 20
            // then take the repeating listeners into account
            int firstTimeListeners = course.getFirstTimeStudents().size();
            int repeatingStudents = course.getRepeatingStudents().size();
            int courseStudentsSize;

            if (groupType.equals("Laboratory")) {
                courseStudentsSize = firstTimeListeners + repeatingStudents;
            } else {
                courseStudentsSize = firstTimeListeners < 100 ?
                        (firstTimeListeners + repeatingStudents)
                        : firstTimeListeners;
            }

            if (courseStudentsSize <= groupMaxCapacity) {
                groups.add(new Group(groupType, courseStudentsSize, course, null));
            } else {
                int counter = courseStudentsSize;
                do {
                    if (counter - groupMaxCapacity > groupMaxCapacity) {
                        groups.add(new Group(groupType, groupMaxCapacity, course, null));
                    } else {
                        int size_one, size_two;

                        if (counter % 2 == 0) {
                            size_one = size_two = counter / 2;
                        } else {
                            size_one = (int) Math.ceil((double) counter / 2);
                            size_two = (int) Math.floor((double) counter / 2);
                        }
                        groups.add(new Group(groupType, size_one, course, null));
                        groups.add(new Group(groupType, size_two, course, null));
                    }
                } while ((counter = counter - groupMaxCapacity) > groupMaxCapacity);
            }
        });

        groups.sort(new GroupComparator());
        Vector<Group> firstIterationGroup = new Vector<>(groups);
        Vector<Group> secondIterationGroup = new Vector<>();

        // Assign a professor to the groups with a limit of 5 assignments per professor
        while(firstIterationGroup.size() > 0){
            Group currentGroup = GroupHelper.getNextElement(
                    0,
                    firstIterationGroup,
                    groups,
                    firstIterationGroup.get(0).getCourse().getSubject().getId(),
                    Objects.requireNonNull(GroupType.getGroupEnum(groupType))
            );
            try {
                if(currentGroup != null) {
                    Course course = currentGroup.getCourse();
                    Professor professor = ProfessorHelper.assignProfessorToCourseGroup(
                            groups,
                            course,
                            currentGroup.getType(),
                            false);
                    updateProfessorsOfCourse(professor, currentGroup.getCourse());
                    groups.stream().filter(group -> group.getId() == currentGroup.getId())
                            .findFirst()
                            .ifPresent(group -> group.setProfessor(professor));
                    currentGroup.setProfessor(professor);
                    firstIterationGroup.remove(currentGroup);
                }
                else{
                    int subjectID = firstIterationGroup.get(0).getCourse().getSubject().getId();
                    firstIterationGroup.stream()
                            .filter(group -> group.getCourse().getSubject().getId() == subjectID)
                            .forEach(secondIterationGroup::add);
                    firstIterationGroup = new Vector<>(GroupHelper.removeElementsWithSubject(firstIterationGroup, subjectID));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // Assign a professor to the groups that were left without an assignment because of the limit
        if(secondIterationGroup.size() > 0) {
            secondIterationGroup.forEach(group -> {
                try {
                    Professor professor = ProfessorHelper.assignProfessorToCourseGroup(
                            groups,
                            group.getCourse(),
                            group.getType(),
                            true);

                    if(professor == null){
                        switch (groupType){
                            case "Exercises": professor = ProfessorHelper.assignProfessorToCourseGroup(groups, group.getCourse(), "Lecture", true); break;
                            case "Laboratory": professor = ProfessorHelper.assignProfessorToCourseGroup(groups, group.getCourse(), "Exercises", true); break;
                            default: break;
                        }
                    }

                    if(professor == null && groupType.equals("Laboratory")){
                        professor = ProfessorHelper.assignProfessorToCourseGroup(groups, group.getCourse(), "Lecture", true);
                    }

                    if(professor != null){
                        updateProfessorsOfCourse(professor, group.getCourse());
                        group.setProfessor(professor);
                    }
                    else{
                        groups.remove(group);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        groupRepository.saveAll(groups);
        while(groups.size() > groupRepository.findAll().size()){
            System.out.println("saving...");
        }
    }


    private void updateProfessorsOfCourse(Professor professor, Course course){
        if(professor != null){
            String subjectName = course.getSubject().getName().toUpperCase().trim();
            Subject updateSubject = subjectRepository.findByName(course.getSubject().getName());
            List<Professor> tempProf = updateSubject.getProfessors();
            tempProf.add(professor);
            updateSubject.setProfessors(tempProf);
            subjectRepository.save(updateSubject);
            SubjectService.subjectsDictionary.replace(subjectName, updateSubject);
        }
    }
}
