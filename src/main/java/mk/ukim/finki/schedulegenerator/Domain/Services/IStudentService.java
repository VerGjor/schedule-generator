package mk.ukim.finki.schedulegenerator.Domain.Services;

import java.io.InputStream;

public interface IStudentService {
    void InsertAllStudents(InputStream uploadedInputStream, String uploadedFileLocation) throws Exception;
    long numberOfUploadedStudents();
}
