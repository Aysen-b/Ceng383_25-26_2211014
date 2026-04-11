using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;

namespace Lab3.Pages
{
    public class StudentGradesModel : PageModel
    {
        public List<Student> Students { get; set; } = new List<Student>();

        public void OnGet()
        {
            Students = new List<Student>
            {
                new Student { Name = "Ayşe", Midterm = 70, Final = 80, LetterGrade = "-" },
                new Student { Name = "Mehmet", Midterm = 55, Final = 60, LetterGrade = "-" },
                new Student { Name = "Zeynep", Midterm = 90, Final = 75, LetterGrade = "-" }
            };
        }

        public void OnPostCalculate()
        {
            OnGet();

            foreach (var student in Students)
            {
                double avg = student.Midterm * 0.4 + student.Final * 0.6;

                if (avg >= 90) student.LetterGrade = "AA";
                else if (avg >= 80) student.LetterGrade = "BB";
                else if (avg >= 70) student.LetterGrade = "CB";
                else if (avg >= 60) student.LetterGrade = "DD";
                else student.LetterGrade = "FF";
            }
        }

        public class Student
        {
            public string Name { get; set; } = "";
            public int Midterm { get; set; }
            public int Final { get; set; }
            public string LetterGrade { get; set; } = "-";
        }
    }
}