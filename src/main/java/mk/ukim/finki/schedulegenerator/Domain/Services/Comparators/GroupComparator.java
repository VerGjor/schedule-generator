package mk.ukim.finki.schedulegenerator.Domain.Services.Comparators;

import mk.ukim.finki.schedulegenerator.Domain.Models.Group;

import java.util.Comparator;

public class GroupComparator implements Comparator<Group> {
    @Override
    public int compare(Group group, Group t1) {
        if(group.getCapacity() == t1.getCapacity())
            return group.getCourse().getSubject().getName().compareTo(t1.getCourse().getSubject().getName());
        return group.getCapacity() < t1.getCapacity() ? -1 : 1;
    }
}
