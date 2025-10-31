import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UserSettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UserSettingsDialog({ open, onOpenChange }: UserSettingsDialogProps) {
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");

	const handleSave = () => {
		// TODO: wire to API when available
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Настройки профиля</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-2">
					<div className="space-y-2">
						<Label htmlFor="displayName">Отображаемое имя</Label>
						<Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ваше имя" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
					</div>
				</div>
				<div className="flex justify-end gap-3">
					<Button variant="outline" onClick={() => onOpenChange(false)}>Отменить</Button>
					<Button onClick={handleSave}>Сохранить</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
