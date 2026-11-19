import { useEffect } from "react";

import { useCopy } from "../../../lib/language";
import { useCharacters } from "../lib/storage";
import { COPY } from "./copy";
import { CharacterSheet } from "./sheet";
import { Topbar } from "./topbar";

/** A character's sheet on its own, ready to print: the print styles keep only the sheet. */
export const SheetPage = ({ id }: { id: string }) => {
  const t = useCopy(COPY);
  const character = useCharacters().find((entry) => entry.id === id);
  const found = Boolean(character);

  // Export as PDF opens the sheet with ?print: the print dialog, where it
  // saves as a PDF, once
  useEffect(() => {
    if (found && new URLSearchParams(window.location.search).has("print")) {
      window.history.replaceState(null, "", window.location.pathname);
      window.print();
    }
  }, [found]);

  return (
    <div className="page dotted">
      <Topbar character={character?.id} page="sheet">
        {character ? (
          <button
            type="button"
            className="pill primary"
            onClick={() => window.print()}
          >
            {t.print}
          </button>
        ) : null}
      </Topbar>
      <main className="sheet-page">
        {character ? (
          <CharacterSheet character={character} />
        ) : (
          <p className="lead">{t.empty}</p>
        )}
      </main>
    </div>
  );
};
