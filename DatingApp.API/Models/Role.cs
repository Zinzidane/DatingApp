using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace DatingApp.API.Models
{
    public class Role : IndentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}