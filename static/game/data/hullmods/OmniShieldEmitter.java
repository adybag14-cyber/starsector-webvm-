package data.hullmods;

import com.fs.starfarer.api.combat.BaseHullMod;
import com.fs.starfarer.api.combat.MutableShipStatsAPI;
import com.fs.starfarer.api.combat.ShieldAPI;
import com.fs.starfarer.api.combat.ShipAPI;
import com.fs.starfarer.api.combat.ShieldAPI.ShieldType;
import com.fs.starfarer.api.combat.ShipAPI.HullSize;

public class OmniShieldEmitter extends BaseHullMod {

	public static final float ARC_PENALTY = 50f;
	
	public void applyEffectsBeforeShipCreation(HullSize hullSize, MutableShipStatsAPI stats, String id) {
		stats.getShieldArcBonus().modifyMult(id, 1f - ARC_PENALTY * 0.01f);
	}
	
	public void applyEffectsAfterShipCreation(ShipAPI ship, String id) {
		ShieldAPI shield = ship.getShield();
		if (shield != null) {
			shield.setType(ShieldType.OMNI);
		}
	}

	
	public String getDescriptionParam(int index, HullSize hullSize) {
		//if (index == 0) return "" + (int) ARC_PENALTY;
		if (index == 0) return "" + (int) ARC_PENALTY + "%";
		return null;
	}

	public boolean isApplicableToShip(ShipAPI ship) {
		return ship != null && ship.getShield() != null && (ship.getHullSpec().getDefenseType() == ShieldType.FRONT ||
				(ship.getHullSpec().getDefenseType() == ShieldType.OMNI && 
						ship.getVariant().getHullMods().contains("frontshield")));		
	}
	
	public String getUnapplicableReason(ShipAPI ship) {
		if (ship == null || ship.getShield() == null) return "Ship has no shields";
		
		if (ship.getHullSpec().getDefenseType() == ShieldType.OMNI && 
				!ship.getVariant().getHullMods().contains("frontshield")) {
			return "Ship already has omni-directional shields";
		}
		
		return null;
	}
	
}
