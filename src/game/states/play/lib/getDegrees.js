// максимальный и минимальный угол
const minAngle = -50;
const maxAngle = 50;

// конвертер радиан в градусы 
export default function getDegrees(radians) {
    let angle = radians * 180 / Math.PI;

    // возвращаем угол от -90 до 90
    if (angle >= 90 && angle <= 180) {
        angle = 90 - (angle - 90);
    };
    if (angle <= -90 && angle >= -180) {
        angle = -90 - (angle + 90);
    };

    // если угол наклона меньше minAngle или больше maxAngle -> возвращаем minAngle и maxAngle соответственно
    if (angle > maxAngle) {
        angle = maxAngle;
    };
    if (angle < minAngle) {
        angle = minAngle;
    }

    return angle;
}
