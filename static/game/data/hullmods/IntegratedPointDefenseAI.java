package data.hullmods;

import java.util.Iterator;
import java.util.List;

import com.fs.starfarer.api.combat.BaseHullMod;
import com.fs.starfarer.api.combat.ShipAPI;
import com.fs.starfarer.api.combat.WeaponAPI;
import com.fs.starfarer.api.combat.ShipAPI.HullSize;
import com.fs.starfarer.api.combat.WeaponAPI.WeaponSize;
import com.fs.starfarer.api.combat.WeaponAPI.WeaponType;

public class IntegratedPointDefenseAI extends BaseHullMod {

	public void applyEffectsAfterShipCreation(ShipAPI ship, String id) {
		List weapons = ship.getAllWeapons();
		Iterator iter = weapons.iterator();
		while (iter.hasNext()) {
			WeaponAPI weapon = (WeaponAPI)iter.next();
//			if (weapon.hasAIHint(AIHints.PD)) {
//				weapon.get
//			}
			if (weapon.getSize() == WeaponSize.SMALL && weapon.getType() != WeaponType.MISSILE) {
				weapon.setPD(true);
			}
		}
	}
	
	public String getDescriptionParam(int index, HullSize hullSize) {
		return null;
	}


}
