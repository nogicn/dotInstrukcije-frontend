using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DotgetPredavanje2.Data;
using DotgetPredavanje2.Models;

namespace DotgetPredavanje2.Pages.InstructionsDate
{
    public class EditModel : PageModel
    {
        private readonly DotgetPredavanje2.Data.AppContextExample _context;

        public EditModel(DotgetPredavanje2.Data.AppContextExample context)
        {
            _context = context;
        }

        [BindProperty]
        public Models.InstructionsDate InstructionsDate { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var instructionsdate =  await _context.InstructionsDate.FirstOrDefaultAsync(m => m.ID == id);
            if (instructionsdate == null)
            {
                return NotFound();
            }
            InstructionsDate = instructionsdate;
            return Page();
        }

        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(InstructionsDate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InstructionsDateExists(InstructionsDate.ID))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool InstructionsDateExists(int id)
        {
            return _context.InstructionsDate.Any(e => e.ID == id);
        }
    }
}
