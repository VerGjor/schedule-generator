package mk.ukim.finki.schedulegenerator.Domain.Services.Comparators;

import mk.ukim.finki.schedulegenerator.Domain.Models.Professor;

import java.util.Comparator;

public class ProfessorComparator implements Comparator<Professor> {
    @Override
    public int compare(Professor o1, Professor o2) {
        if (o1.get_teachesSubjects().size() == o2.get_teachesSubjects().size())
            return o1.getLastName().compareTo(o2.getLastName());
        return o1.get_teachesSubjects().size() < o2.get_teachesSubjects().size() ? -1 : 1;
    }
}
