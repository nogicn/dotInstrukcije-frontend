using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using DotgetPredavanje2.Data;
using DotgetPredavanje2.Models;

namespace DotgetPredavanje2.Pages.Stanje
{
    public class DeleteModel : PageModel
    {
        private readonly DotgetPredavanje2.Data.AppContextExample _context;

        public DeleteModel(DotgetPredavanje2.Data.AppContextExample context)
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

            var stanjezahtjeva = await _context.StanjeZahtjeva.FirstOrDefaultAsync(m => m.ID == id);

            if (stanjezahtjeva == null)
            {
                return NotFound();
            }
            else
            {
                StanjeZahtjeva = stanjezahtjeva;
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var stanjezahtjeva = await _context.StanjeZahtjeva.FindAsync(id);
            if (stanjezahtjeva != null)
            {
                StanjeZahtjeva = stanjezahtjeva;
                _context.StanjeZahtjeva.Remove(StanjeZahtjeva);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
