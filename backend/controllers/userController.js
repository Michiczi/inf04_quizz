import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { name, login, password } = req.body;

  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(409).send("Taki email znajduję się już w bazie");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      login,
      password: hashedPassword,
      bestScore: 0,
      role: "user",
    });

    await newUser.save();
    console.log("Dodano użytkownika:", newUser.login);
    res.status(200).send({ message: "Użytkownik został dodany pomyślnie" });
  } catch (error) {
    console.error("Błąd podczas rejestracji użytkownika:", error);
    res.status(500).send("Błąd serwera podczas rejestracji.");
  }
};

export const registerAdmin = async (req, res) => {
  const { secret } = req.params;
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return res
      .status(403)
      .send("Nieprawidłowy klucz sekretny do rejestracji administratora.");
  }

  const { name, login, password } = req.body;

  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(409).send("Taki email znajduję się już w bazie");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      login,
      password: hashedPassword,
      bestScore: 0,
      role: "admin", // Admin role
    });

    await newUser.save();
    console.log("Dodano administratora:", newUser.login);
    res.status(200).send({ message: "Administrator został dodany pomyślnie" });
  } catch (error) {
    console.error("Błąd podczas rejestracji administratora:", error);
    res.status(500).send("Błąd serwera podczas rejestracji.");
  }
};

export const login = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login });

    if (!user) {
      return res.status(401).send("Błędne dane logowania");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Błędne dane logowania");
    }

    req.session.user = { id: user._id, login: user.login, role: user.role }; // Zapisywać rolę użytkownika
    req.session.save(async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Błąd sesji");
      }
      console.log(`Użytkownik ${user.login} zalogowany. Rola: ${user.role}`);
      res.status(200).send({ message: "Wszystko ok", role: user.role });
    });
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).send("Błąd serwera podczas logowania.");
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Błąd podczas niszczenia sesji:", err);
      return res.status(500).send("Błąd serwera podczas wylogowywania.");
    }
    res.status(200).send("Wylogowano pomyślnie.");
  });
};

export const getHighscore = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("Nie znaleziono użytkownika.");
    }

    res.status(200).json({ highscore: user.bestScore });
  } catch (error) {
    console.error("Błąd podczas pobierania highscore:", error);
    res.status(500).send("Błąd serwera.");
  }
};

export const updateHighscore = async (req, res) => {
  const userId = req.session.user.id;
  const { highscore } = req.body;

  if (typeof highscore !== "number") {
    return res.status(400).send("Nieprawidłowy format rekordu.");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("Nie znaleziono użytkownika.");
    }

    if (highscore > user.bestScore) {
      user.bestScore = highscore;
      await user.save(); // Save the updated user to MongoDB
      console.log(`Zaktualizowano rekord dla ${user.login}: ${user.bestScore}`);
    }

    res.status(200).send({ message: "Rekord zaktualizowany." });
  } catch (error) {
    console.error("Błąd podczas aktualizacji highscore:", error);
    res.status(500).send("Błąd serwera.");
  }
};

export const getUser = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("Nie znaleziono użytkownika.");
    }

    res.status(200).send({
      login: user.login,
      name: user.name,
      bestScore: user.bestScore,
      role: user.role,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania danych użytkownika:", error);
    res.status(500).send("Błąd serwera.");
  }
};
