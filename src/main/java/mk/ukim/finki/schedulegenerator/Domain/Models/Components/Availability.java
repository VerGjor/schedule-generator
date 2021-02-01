package mk.ukim.finki.schedulegenerator.Domain.Models.Components;

import mk.ukim.finki.schedulegenerator.Domain.Models.Enums.WeekDay;

import javax.persistence.Entity;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

// Component, no separate page
@Entity
@Table(name = "availabilities")
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "availability_id")
    private int id;

    @Column(name = "available_day")
    private WeekDay day;

    private DayAvailabilityEncoding availability;

    private Availability(WeekDay day, String availability) {
        this.day = day;
        this.availability = new DayAvailabilityEncoding(availability);
    }

    public Availability() {
    }

    // A function to fill the initial availabilities when a professor or a classroom is created
    public List<Availability> fillInitAvailabilities() {
        List<Availability> av = new ArrayList<>();
        String format = "_aaaaaaaaaaaa";
        for(int i=0; i < 5; i++){
            av.add(new Availability(WeekDay.values()[i],(i+1)+format));
        }
        return av;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public WeekDay getDay() {
        return day;
    }

    public void setDay(WeekDay day) {
        this.day = day;
    }

    public DayAvailabilityEncoding getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = new DayAvailabilityEncoding(availability);
    }
}
