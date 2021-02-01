package mk.ukim.finki.schedulegenerator.Domain.Services.Comparators;

import mk.ukim.finki.schedulegenerator.Domain.Models.Group;
import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;

import java.util.Comparator;
import java.util.Vector;

public class ProfessorAssignmentComparator implements Comparator<Professor> {

    private Vector<Group> groups;

    public ProfessorAssignmentComparator(Vector<Group> groups){
        this.groups = new Vector<>(groups);
    }

    @Override
    public int compare(Professor professor, Professor t1) {
        long p1 = groups.stream()
                .filter(group -> group.getProfessor() != null)
                .filter(group -> group.getProfessor().getId() == professor.getId())
                .count();

        long p2 = groups.stream()
                .filter(group -> group.getProfessor() != null)
                .filter(group -> group.getProfessor().getId() == t1.getId())
                .count();

        if (p1 == p2)
            return professor.getLastName().compareTo(t1.getLastName());
        return p1 < p2 ? -1 : 1;
    }
}
