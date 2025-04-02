using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

namespace WaterProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WaterController : ControllerBase
    {
        private WaterDbContext _context;

        public WaterController(WaterDbContext temp) => _context = temp;

        [HttpGet("AllProjects")]
        public IActionResult GetProjects(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? projectTypes = null)
        {
            
            var query = _context.Projects.AsQueryable();

            if (projectTypes != null && projectTypes.Any())
            {
                query = query.Where(p => projectTypes.Contains(p.ProjectType));
            }
            
            string favoriteProjType = Request.Cookies["FavoriteProjectType"];
            Console.WriteLine("~~~~COOKIE~~~~~\n" + favoriteProjType);
            
            HttpContext.Response.Cookies.Append("FavoriteProjectType", "Protected Spring", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddMinutes(3)
            });
            
            var totalNumProjects = query.Count();
            
            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            
            var someObject = new
            {
                Projects = something,
                TotalNumProjects = totalNumProjects
            };

            return Ok(someObject);
        }

        [HttpGet("GetProjectTypes")]
        public IActionResult GetProjectTypes()
        {
            var projectTypes = _context.Projects
                .Select(p => p.ProjectType)
                .Distinct()
                .ToList();
            
            return Ok(projectTypes);
        }

        [HttpGet("FunctionalProjects")]
        public IEnumerable<Project> GetFunctionalProjects()
        {
            var something = _context.Projects.Where(p => p.ProjectFunctionalityStatus == "Functional").ToList();
            return something;
        }

        [HttpPost("AddProject")]
        public IActionResult AddProject([FromBody] Project newProject)
        {
            _context.Projects.Add(newProject);
            _context.SaveChanges();
            return Ok(newProject);
        }

        [HttpPut("UpdateProject/{projectId}")]
        public IActionResult UpdateProject(int projectId, [FromBody] Project updatedProject)
        {
            var existingProject = _context.Projects.Find(projectId);

            existingProject.ProjectName = updatedProject.ProjectName;
            existingProject.ProjectType = updatedProject.ProjectType;
            existingProject.ProjectFunctionalityStatus = updatedProject.ProjectFunctionalityStatus;
            existingProject.ProjectImpact = updatedProject.ProjectImpact;
            existingProject.ProjectPhase = updatedProject.ProjectPhase;
            existingProject.ProjectRegionalProgram = updatedProject.ProjectRegionalProgram;

            _context.Projects.Update(existingProject);
            _context.SaveChanges();

            return Ok(existingProject);
        }

        [HttpDelete("DeleteProject/{projectId}")]
        public IActionResult DeleteProject(int projectId)
        {
            var project = _context.Projects.Find(projectId);

            if (project == null)
            {
                return NotFound(new {message = "Project not found"});
            }

            _context.Projects.Remove(project);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
