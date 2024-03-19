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
    public class DetailsModel : PageModel
    {
        private readonly DotgetPredavanje2.Data.AppContextExample _context;

        public DetailsModel(DotgetPredavanje2.Data.AppContextExample context)
        {
            _context = context;
        }

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
    }
}
