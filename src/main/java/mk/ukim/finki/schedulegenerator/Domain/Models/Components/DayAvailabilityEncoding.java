package mk.ukim.finki.schedulegenerator.Domain.Models.Components;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class DayAvailabilityEncoding {

    @Column(name = "available_slots")
    // Format: dayIndex_aaOaaOOaOaOa
    private String availability;

    DayAvailabilityEncoding(String availability) {
        this.availability = availability;
    }

    public DayAvailabilityEncoding() {
        this.availability = "1_aaaaaaaaaaaaaa";
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    private String replaceCharacter(int from, int to, char replacement){
        StringBuilder reserveString = new StringBuilder(availability);

        for(int i= from; i < to; i++ )
            reserveString.setCharAt(i, replacement);

        return reserveString.toString();
    }

    public void reserve(int hourFrom, int hourTo) {
        availability = replaceCharacter(
                hourToIndex(hourFrom),
                hourToIndex(hourTo),
                'O' );
    }

    public void free(int hourFrom, int hourTo) {
        availability = replaceCharacter(
                hourToIndex(hourFrom),
                hourToIndex(hourTo),
                'a' );
    }

    public boolean isFree(int hourFrom, int hourTo) {
        return !availability
                .substring(hourToIndex(hourFrom), hourToIndex(hourTo))
                .chars()
                .filter( (a) -> a == 'O')
                .findFirst()
                .isPresent();

    }

    // Skips the dayIndex and the "_" separator
    private int hourToIndex(int hour) {
        System.out.println("Hour to Index : " + (hour - 6));
        return hour - 6;
    }


}
