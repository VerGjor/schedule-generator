package mk.ukim.finki.schedulegenerator.Infrastructure.Repository;

import mk.ukim.finki.schedulegenerator.Domain.Models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISubjectRepositoryJPA extends JpaRepository<Subject, Integer> {

    Subject findByName(String name);
    List<Subject> findAllBySemester(String semester);
    boolean existsByName(String name);

}
