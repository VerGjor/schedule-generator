package mk.ukim.finki.schedulegenerator.Domain.Models.Components;

import javax.persistence.Embeddable;

// Component
@Embeddable
public class SchoolYear {

    private boolean winterSemester;

    // Example: 2019/2020
    private String schoolYear;

    public SchoolYear(boolean winterSemester, String schoolYear) {
        this.winterSemester = winterSemester;
        this.schoolYear = schoolYear;
    }

    public SchoolYear(){}

    public boolean isWinterSemester() {
        return winterSemester;
    }

    public void setWinterSemester(boolean winterSemester) {
        this.winterSemester = winterSemester;
    }

    public String getSchoolYear() {
        return schoolYear;
    }

    public void setSchoolYear(String schoolYear) {
        this.schoolYear = schoolYear;
    }
}
