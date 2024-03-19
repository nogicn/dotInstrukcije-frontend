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
    public class IndexModel : PageModel
    {
        private readonly DotgetPredavanje2.Data.AppContextExample _context;

        public IndexModel(DotgetPredavanje2.Data.AppContextExample context)
        {
            _context = context;
        }

        public IList<StanjeZahtjeva> StanjeZahtjeva { get;set; } = default!;

        public async Task OnGetAsync()
        {
            StanjeZahtjeva = await _context.StanjeZahtjeva.ToListAsync();
        }
    }
}
