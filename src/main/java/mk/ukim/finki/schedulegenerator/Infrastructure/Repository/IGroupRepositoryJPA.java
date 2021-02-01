package mk.ukim.finki.schedulegenerator.Infrastructure.Repository;

import mk.ukim.finki.schedulegenerator.Domain.Models.Enums.GroupType;
import mk.ukim.finki.schedulegenerator.Domain.Models.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IGroupRepositoryJPA extends JpaRepository<Group, Integer> {
    void deleteByCourse_SchoolYear_SchoolYearAndCourse_Subject_SemesterAndType(
            String course_schoolYear_schoolYear,
            String course_subject_semester,
            GroupType type);
}
