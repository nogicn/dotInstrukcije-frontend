using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using DotgetPredavanje2.Data;
using DotgetPredavanje2.Models;

namespace DotgetPredavanje2.Pages.Subject
{
    public class DeleteModel : PageModel
    {
        private readonly DotgetPredavanje2.Data.AppContextExample _context;

        public DeleteModel(DotgetPredavanje2.Data.AppContextExample context)
        {
            _context = context;
        }

        [BindProperty]
        public Models.Subject Subject { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var subject = await _context.Subject.FirstOrDefaultAsync(m => m.ID == id);

            if (subject == null)
            {
                return NotFound();
            }
            else
            {
                Subject = subject;
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var subject = await _context.Subject.FindAsync(id);
            if (subject != null)
            {
                Subject = subject;
                _context.Subject.Remove(Subject);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
