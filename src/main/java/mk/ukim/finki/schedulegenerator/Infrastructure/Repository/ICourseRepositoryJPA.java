package mk.ukim.finki.schedulegenerator.Infrastructure.Repository;


import mk.ukim.finki.schedulegenerator.Domain.Models.Components.SchoolYear;
import mk.ukim.finki.schedulegenerator.Domain.Models.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICourseRepositoryJPA extends JpaRepository<Course, Integer> {
    void deleteBySchoolYear(SchoolYear schoolYear);
}
