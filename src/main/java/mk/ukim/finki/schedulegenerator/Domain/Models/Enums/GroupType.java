package mk.ukim.finki.schedulegenerator.Domain.Models.Enums;

public enum GroupType {
    LECTURE("Lecture"),
    EXERCISES("Exercises"),
    LABORATORY("Laboratory");

    final String groupType;

    GroupType(String name){
        groupType = name;
    }

    public String getType(){
        return groupType;
    }

    public static GroupType getGroupEnum(String name){
        for(GroupType g : GroupType.values()){
            if(g.getType().equals(name))
                return g;
        }
        return null;
    }

}
