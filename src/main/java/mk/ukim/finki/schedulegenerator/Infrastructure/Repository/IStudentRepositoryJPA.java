package mk.ukim.finki.schedulegenerator.Infrastructure.Repository;

import mk.ukim.finki.schedulegenerator.Domain.Models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IStudentRepositoryJPA extends JpaRepository<Student, String> {
}
