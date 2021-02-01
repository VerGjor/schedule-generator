package mk.ukim.finki.schedulegenerator.Domain.Services.Helpers;

public class GroupDetails {
    private int capacity;
    private String professor;

    public GroupDetails(int capacity, String professor) {
        this.capacity = capacity;
        this.professor = professor;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getProfessor() {
        return professor;
    }

    public void setProfessor(String professor) {
        this.professor = professor;
    }
}
