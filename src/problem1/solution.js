// Cách 1: Dùng vòng lặp for
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Cách 2: Dùng công thức Gauss (tính toán trực tiếp)
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

// Cách 3: Dùng đệ quy
var sum_to_n_c = function(n) {
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};

