import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  hint?: string;
}

const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"];
const strengthColor = [
  "bg-destructive",
  "bg-destructive",
  "bg-yellow-400",
  "bg-primary",
  "bg-primary",
];

export const PasswordInput = ({ id, label, value, onChange, placeholder = "••••••••", showStrength, hint }: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  const strength = showStrength && value ? getStrength(value) : -1;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-tanker">{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="pl-9 pr-10 font-tanker"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && value && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : "bg-muted"}`}
              />
            ))}
          </div>
          <p className={`text-xs font-tanker ${strength >= 3 ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {strengthLabel[strength] ?? ""}
          </p>
        </div>
      )}
      {hint && !showStrength && <p className="text-xs text-muted-foreground font-tanker">{hint}</p>}
    </div>
  );
};
