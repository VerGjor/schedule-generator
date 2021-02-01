package mk.ukim.finki.schedulegenerator.Infrastructure.Repository;

import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IProfessorRepositoryJPA extends JpaRepository<Professor, Integer> {

    boolean existsByFirstNameAndLastName(String firstName, String lastName);
    Professor findByFirstNameAndLastName(String firstName, String lastName);

}
