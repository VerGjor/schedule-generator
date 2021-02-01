package mk.ukim.finki.schedulegenerator.Application.Controllers;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(StudentController.class)
public class StudentControllerTest {

    private MockMvc mockMvc;

    @Autowired
    WebApplicationContext wContext;

    @MockBean
    private StudentController controller;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wContext)
                .alwaysDo(MockMvcResultHandlers.print())
                .build();
    }

    @Test
    public void studentControllerTest() throws Exception {

        // Read students from file test
        MockMultipartFile jsonFile =
                new MockMultipartFile(
                        "students.txt",
                        "",
                        "application/json",
                        "file".getBytes());

        mockMvc.perform(MockMvcRequestBuilders.multipart("/students/insert/all")
                .file("file", jsonFile.getBytes())
                .characterEncoding("UTF-8"))
                .andExpect(status().isOk());

    }




}
