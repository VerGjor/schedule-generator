package mk.ukim.finki.schedulegenerator.Domain.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Teacher Not Found Exception")
public class TeacherNotFoundException extends RuntimeException{

    /**
     *
     */
    private static final long serialVersionUID = 1L;
}
