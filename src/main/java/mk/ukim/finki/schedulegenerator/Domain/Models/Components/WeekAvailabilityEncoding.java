package mk.ukim.finki.schedulegenerator.Domain.Models.Components;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class WeekAvailabilityEncoding {

    @Column(name = "week_available_slots")
    // Format: 1_aaOaaOOaOaOa;2_aaOaaOOaOaOa;3_aaOaaOOaOaOa;4_aaOaaOOaOaOa;5_aaOaaOOaOaOa;6_aaOaaOOaOaOa;7_aaOaaOOaOaOa
    private String availability;

    public WeekAvailabilityEncoding(String availability) {
        this.availability = availability;
    }


    public WeekAvailabilityEncoding() {
        this.availability = "1_aaaaaaaaaaaaaa";
    }

    public void reserve(int day, int hour, int hourTo) {

    }

    public void free(int hourFrom, int hourTo) {

    }

    public void isFree(int hourFrom, int hourTo) {

    }

    private int hourToIndex(int hour) {
        return hour - 6;
    }


}
