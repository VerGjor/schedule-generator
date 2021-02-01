package mk.ukim.finki.schedulegenerator.Domain.Models.Components;

import javax.persistence.*;

// Component, no separate page
@Entity
@Table(name = "occurrences")
public class Occurrences {

    @Id
    @Column(name = "occurrence_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int occurrence_id;

    @Column(name = "occurrence")
    private String occurrences;

    public int getOccurrences() {
        return Integer.parseInt(occurrences.split("_")[0]);
    }

    public String getSubject() {
        return occurrences.split("_")[1];
    }

    public String getID() {
        return occurrences;
    }

    public void setOccurrences(String occurrences) {
        this.occurrences = occurrences;
    }

}
