<?php

declare(strict_types=1);

namespace MiniShop;

final class Money
{
    /** 1290 → « 12,90 € » */
    public static function format(int $cents): string
    {
        $sign = $cents < 0 ? '−' : '';
        $cents = abs($cents);

        return sprintf('%s%s,%02d €', $sign, number_format(intdiv($cents, 100), 0, ',', ' '), $cents % 100);
    }
}
