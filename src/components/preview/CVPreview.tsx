import type { CVProfile } from "@/types/cv";
import CanadianPreview from "./canadian/CanadianPreview";
import ClassicPreview from "./classic/ClassicPreview";
import ModernPreview from "./modern/ModernPreview";
import EuropassPreview from "./europass/EuropassPreview";
import ATSPreview from "./ats/ATSPreview";
import GulfPreview from "./gulf/GulfPreview";

interface Props {
  cv: CVProfile;
  forPDF?: boolean;
}

export default function CVPreview({ cv, forPDF = false }: Props) {
  switch (cv.activeStyleId) {
    case "classic":   return <ClassicPreview   cv={cv} forPDF={forPDF} />;
    case "modern":    return <ModernPreview     cv={cv} forPDF={forPDF} />;
    case "europass":  return <EuropassPreview   cv={cv} forPDF={forPDF} />;
    case "ats":       return <ATSPreview        cv={cv} forPDF={forPDF} />;
    case "gulf":      return <GulfPreview       cv={cv} forPDF={forPDF} />;
    case "canadian":
    default:          return <CanadianPreview   cv={cv} forPDF={forPDF} />;
  }
}
