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

namespace DotgetPredavanje2.Pages.Stanje
{
    public class EditModel : PageModel
    {
        private readonly DotgetPredavanje2.Data.AppContextExample _context;

        public EditModel(DotgetPredavanje2.Data.AppContextExample context)
        {
            _context = context;
        }

        [BindProperty]
        public StanjeZahtjeva StanjeZahtjeva { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var stanjezahtjeva =  await _context.StanjeZahtjeva.FirstOrDefaultAsync(m => m.ID == id);
            if (stanjezahtjeva == null)
            {
                return NotFound();
            }
            StanjeZahtjeva = stanjezahtjeva;
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

            _context.Attach(StanjeZahtjeva).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StanjeZahtjevaExists(StanjeZahtjeva.ID))
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

        private bool StanjeZahtjevaExists(int id)
        {
            return _context.StanjeZahtjeva.Any(e => e.ID == id);
        }
    }
}
