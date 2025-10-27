/**
 * Domácí úkol 3 — Průměr známek studentů (JS + DTO)
 */

function main(dtoIn) {
  // 1. Určení vstupních parametrů
  // Načteme dtoIn.students (povinné pole objektů studentů).

  // 2. = Sequence — Příprava a ošetření vstupních dat
  // 2.1 Ověření přítomnosti dtoIn a typu
  if (!dtoIn || typeof dtoIn !== "object") throw new Error("dtoIn musí být objekt.");

  // 2.2 Načtení pole studentů
  const studentList = dtoIn.students;

  // 3. = Selection — Validace vstupu
  // 3.A If — students není pole → chyba
  if (!Array.isArray(studentList)) throw new Error("Vstup dtoIn.students musí být pole.");

  // 2.3 Inicializace akumulátorů a výstupních struktur
  const uuAppErrorMap = {};        // varování / poznámky
  const studentAverages = [];      // { fullName, average }
  let totalStudentsCount = 0;      // kolik studentů bylo započteno
  let totalGradesSum = 0;          // součet průměrů studentů

  // 2.4 Pomocné funkce
  function getStudentGrades(student) {
    // Vrátí pole číselných známek nebo null, pokud nejsou platné
    if (typeof student.grade === "number") return [student.grade];
    if (Array.isArray(student.grades) && student.grades.length > 0) {
      const numeric = student.grades.filter((x) => typeof x === "number");
      return numeric.length ? numeric : null;
    }
    return null;
  }
  function getAverage(grades) {
    // Aritmetický průměr, zaokrouhlený na 1 desetinné místo
    const sum = grades.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / grades.length) * 10) / 10;
  }

  // 4. = Iteration — Výpočet průměru přes všechny studenty
  // Cíl: projít všechny položky v studentList a naplnit studentAverages + akumulátory.
  for (let index = 0; index < studentList.length; index++) {
    // 4.1 Pro každý objekt studenta v poli students
    const student = studentList[index];

    // 4.2 Selection — Výběr platných záznamů
    const grades = getStudentGrades(student);
    if (!grades) {
      // 4.2.A If — grades === null → student nemá platné známky → přeskočit
      uuAppErrorMap[`students[${index}]`] = "Student bez platných známek. Přeskočeno.";
      continue;
    }

    // 4.3 Výpočet průměru studenta
    const studentAverage = getAverage(grades);

    // 4.4 Příprava jména (fallback, pokud chybí)
    const fullName =
      `${student.firstName ?? "Neznámý"} ${student.surname ?? ""}`.trim() ||
      `Student #${index + 1}`;

    // 4.5 Uložení výsledku studenta
    studentAverages.push({ fullName, average: studentAverage });

    // 4.6 Aktualizace akumulátorů
    totalGradesSum += studentAverage;
    totalStudentsCount++;
  }

  // 4.7 Po dokončení cyklu — dopočet celkového průměru
  let overallAverage = null;
  if (totalStudentsCount === 0) {
    // 4.7.A If — žádný započítaný student
    uuAppErrorMap.noCount = "Nebyl započítán žádný student.";
  } else {
    // 4.7.B Else — spočítáme průměr na 1 desetinné místo
    overallAverage = Math.round((totalGradesSum / totalStudentsCount) * 10) / 10;
  }

  // 5. = Return — Vrácení výsledku funkce (dtoOut)
  return {
    average: overallAverage,       // celkový průměr nebo null
    byStudent: studentAverages,    // průměr za každého studenta
    count: totalStudentsCount,     // počet započítaných studentů
    uuAppErrorMap                  // varování a poznámky
  };
}

// Ukázka běhu
const dtoIn = {
  students: [
    { firstName: "Jan", surname: "Novák", grades: [1, 2, 2] },
    { firstName: "Eva", surname: "Svobodová", grade: 1 },
    { firstName: "Petr", surname: "Dvořák", grades: [2, 3, 2] },
    { firstName: "X", grades: [] },
    { firstName: "Y", grade: "neplatné" },
  ],
};

console.log(main(dtoIn));
